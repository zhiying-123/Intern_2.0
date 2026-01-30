-- CreateTable
CREATE TABLE "User" (
    "u_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "access_time" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("u_id")
);

-- CreateTable
CREATE TABLE "Course" (
    "c_id" SERIAL NOT NULL,
    "c_name" TEXT NOT NULL,
    "c_description" TEXT NOT NULL,
    "c_duration" INTEGER NOT NULL,
    "c_price" DOUBLE PRECISION NOT NULL,
    "c_category" TEXT NOT NULL,
    "c_status" TEXT NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "Course_pkey" PRIMARY KEY ("c_id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "s_id" SERIAL NOT NULL,
    "s_name" TEXT NOT NULL,
    "s_duration" INTEGER NOT NULL,
    "s_status" TEXT NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("s_id")
);

-- CreateTable
CREATE TABLE "student_course" (
    "sc_id" SERIAL NOT NULL,
    "u_id" INTEGER NOT NULL,
    "c_id" INTEGER NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "grade_image" TEXT,

    CONSTRAINT "student_course_pkey" PRIMARY KEY ("sc_id")
);

-- CreateTable
CREATE TABLE "course_subject" (
    "cs_id" SERIAL NOT NULL,
    "c_id" INTEGER NOT NULL,
    "s_id" INTEGER NOT NULL,

    CONSTRAINT "course_subject_pkey" PRIMARY KEY ("cs_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_c_name_key" ON "Course"("c_name");

-- CreateIndex
CREATE UNIQUE INDEX "student_course_u_id_c_id_key" ON "student_course"("u_id", "c_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_subject_c_id_s_id_key" ON "course_subject"("c_id", "s_id");

-- AddForeignKey
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "User"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "Course"("c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_subject" ADD CONSTRAINT "course_subject_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "Course"("c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_subject" ADD CONSTRAINT "course_subject_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "Subject"("s_id") ON DELETE RESTRICT ON UPDATE CASCADE;
