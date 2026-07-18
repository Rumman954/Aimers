import type { Response, NextFunction } from "express";
import { Enrollment } from "../models/Enrollment.js";
import { Course } from "../models/Course.js";
import { Interaction } from "../models/Interaction.js";
import { Review } from "../models/Review.js";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthRequest } from "../middleware/auth.js";

export const enrollInCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const course =
      (await Course.findOne({ slug: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course || course.status !== "published") {
      throw new AppError("Course not found", 404);
    }

    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Already enrolled",
        data: existing,
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: course._id,
      progress: Math.floor(Math.random() * 40),
    });

    course.students += 1;
    await course.save();

    await Interaction.create({
      user: req.user._id,
      course: course._id,
      type: "enroll",
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrollments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate("course")
      .sort({ createdAt: -1 });

    const data = enrollments
      .filter((e) => e.course)
      .map((e) => {
        const course = e.course as unknown as {
          slug: string;
          title: string;
          thumbnail: string;
          category: string;
          level: string;
          price: number;
          instructorName: string;
        };
        return {
          id: e._id.toString(),
          progress: e.progress,
          enrolledAt: e.createdAt,
          course: {
            id: course.slug,
            title: course.title,
            thumbnail: course.thumbnail,
            category: course.category,
            level: course.level,
            price: course.price,
            instructorName: course.instructorName,
          },
        };
      });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const isInstructor =
      req.user.role === "instructor" || req.user.role === "admin";

    if (isInstructor) {
      const myCourses = await Course.find({ instructor: req.user._id });
      const courseIds = myCourses.map((c) => c._id);

      const [enrollmentCount, reviewCount, enrollmentsByMonth, categoryBreakdown] =
        await Promise.all([
          Enrollment.countDocuments({ course: { $in: courseIds } }),
          Review.countDocuments({ course: { $in: courseIds } }),
          Enrollment.aggregate([
            { $match: { course: { $in: courseIds } } },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ]),
          Course.aggregate([
            { $match: { instructor: req.user._id } },
            {
              $group: {
                _id: "$category",
                courses: { $sum: 1 },
                students: { $sum: "$students" },
              },
            },
            { $sort: { students: -1 } },
          ]),
        ]);

      const avgRating =
        myCourses.length > 0
          ? Math.round(
              (myCourses.reduce((sum, c) => sum + c.rating, 0) /
                myCourses.length) *
                10
            ) / 10
          : 0;

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return res.json({
        success: true,
        role: "instructor",
        summary: {
          courses: myCourses.length,
          enrollments: enrollmentCount,
          reviews: reviewCount,
          avgRating,
          students: myCourses.reduce((sum, c) => sum + c.students, 0),
        },
        enrollmentsOverTime: enrollmentsByMonth.map((row) => ({
          label: `${monthNames[(row._id.month as number) - 1]} ${row._id.year}`,
          enrollments: row.count,
        })),
        categoryBreakdown: categoryBreakdown.map((row) => ({
          category: row._id,
          courses: row.courses,
          students: row.students,
        })),
        topCourses: myCourses
          .slice()
          .sort((a, b) => b.students - a.students)
          .slice(0, 5)
          .map((c) => ({
            id: c.slug,
            title: c.title,
            students: c.students,
            rating: c.rating,
            price: c.price,
          })),
      });
    }

    // Student dashboard
    const enrollments = await Enrollment.find({ user: req.user._id }).populate(
      "course"
    );

    const progressSeries = enrollments
      .filter((e) => e.course)
      .map((e) => {
        const course = e.course as unknown as { title: string; slug: string };
        return {
          course: course.title.length > 18
            ? `${course.title.slice(0, 18)}…`
            : course.title,
          progress: e.progress,
          id: course.slug,
        };
      });

    const categoryMap = new Map<string, number>();
    for (const e of enrollments) {
      const course = e.course as unknown as { category?: string } | null;
      if (!course?.category) continue;
      categoryMap.set(
        course.category,
        (categoryMap.get(course.category) || 0) + 1
      );
    }

    const avgProgress =
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) /
              enrollments.length
          )
        : 0;

    const views = await Interaction.countDocuments({
      user: req.user._id,
      type: "view",
    });

    res.json({
      success: true,
      role: "student",
      summary: {
        enrollments: enrollments.length,
        avgProgress,
        views,
        completed: enrollments.filter((e) => e.progress >= 100).length,
      },
      progressByCourse: progressSeries,
      categoryBreakdown: Array.from(categoryMap.entries()).map(
        ([category, count]) => ({ category, count })
      ),
      recentEnrollments: enrollments.slice(0, 5).map((e) => {
        const course = e.course as unknown as {
          slug: string;
          title: string;
          thumbnail: string;
          category: string;
        };
        return {
          id: e._id.toString(),
          progress: e.progress,
          course: course
            ? {
                id: course.slug,
                title: course.title,
                thumbnail: course.thumbnail,
                category: course.category,
              }
            : null,
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};
