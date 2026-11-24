import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { InstitutionModule } from './institution/institution.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { GradeModule } from './grade/grade.module';
import { SubjectModule } from './subject/subject.module';
import { ThematicUnitModule } from './thematic-unit/thematic-unit.module';
import { TopicModule } from './topic/topic.module';
import { CompetenceModule } from './competence/competence.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CourseScheduleModule } from './course-schedule/course-schedule.module';
import { ActivityModule } from './activity/activity.module';
import { ActivityLevelModule } from './activity-level/activity-level.module';
import { ActivityCourseModule } from './activity-course/activity-course.module';
import { ProblemModule } from './problem/problem.module';
import { AnswerOptionModule } from './answer-option/answer-option.module';
import { ActivityCompetenceModule } from './activity-competence/activity-competence.module';
import { RubricModule } from './rubric/rubric.module';
import { RubricCriterionModule } from './rubric-criterion/rubric-criterion.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { EvaluationCriterionModule } from './evaluation-criterion/evaluation-criterion.module';
import { ActivityAttemptModule } from './activity-attempt/activity-attempt.module';
import { AttemptResponseModule } from './attempt-response/attempt-response.module';
import { GamificationProfileModule } from './gamification-profile/gamification-profile.module';
import { PointTransactionModule } from './point-transaction/point-transaction.module';
import { BadgeModule } from './badge/badge.module';
import { StudentBadgeModule } from './student-badge/student-badge.module';
import { CompetenceProgressModule } from './competence-progress/competence-progress.module';
import { ReportModule } from './report/report.module';
import { SprintModule } from './sprint/sprint.module';
import { UserStoryModule } from './user-story/user-story.module';
import { ScrumTaskModule } from './scrum-task/scrum-task.module';
import { User } from './user/entities/user.entity';
import { UserRole } from './user-role/entities/user-role.entity';
import { CreateUsuarioRol1795500000000 } from './database/migrations/1795500000000-CreateUsuarioRol';
import { MigrateLegacyUserRoles1795500000001 } from './database/migrations/1795500000001-MigrateLegacyUserRoles';
import { CreateRemainingEduquestTables1795541000000 } from './database/migrations/1795541000000-CreateRemainingEduquestTables';
import { Role } from './role/entities/role.entity';
import { Institution } from './institution/entities/institution.entity';
import { Student } from './student/entities/student.entity';
import { Teacher } from './teacher/entities/teacher.entity';
import { Grade } from './grade/entities/grade.entity';
import { Subject } from './subject/entities/subject.entity';
import { ThematicUnit } from './thematic-unit/entities/thematic-unit.entity';
import { Topic } from './topic/entities/topic.entity';
import { Competence } from './competence/entities/competence.entity';
import { Course } from './course/entities/course.entity';
import { Enrollment } from './enrollment/entities/enrollment.entity';
import { CourseSchedule } from './course-schedule/entities/course-schedule.entity';
import { Activity } from './activity/entities/activity.entity';
import { ActivityLevel } from './activity-level/entities/activity-level.entity';
import { ActivityCourse } from './activity-course/entities/activity-course.entity';
import { Problem } from './problem/entities/problem.entity';
import { AnswerOption } from './answer-option/entities/answer-option.entity';
import { ActivityCompetence } from './activity-competence/entities/activity-competence.entity';
import { Rubric } from './rubric/entities/rubric.entity';
import { RubricCriterion } from './rubric-criterion/entities/rubric-criterion.entity';
import { Evaluation } from './evaluation/entities/evaluation.entity';
import { EvaluationCriterion } from './evaluation-criterion/entities/evaluation-criterion.entity';
import { ActivityAttempt } from './activity-attempt/entities/activity-attempt.entity';
import { AttemptResponse } from './attempt-response/entities/attempt-response.entity';
import { GamificationProfile } from './gamification-profile/entities/gamification-profile.entity';
import { PointTransaction } from './point-transaction/entities/point-transaction.entity';
import { Badge } from './badge/entities/badge.entity';
import { StudentBadge } from './student-badge/entities/student-badge.entity';
import { CompetenceProgress } from './competence-progress/entities/competence-progress.entity';
import { Report } from './report/entities/report.entity';
import { Sprint } from './sprint/entities/sprint.entity';
import { UserStory } from './user-story/entities/user-story.entity';
import { ScrumTask } from './scrum-task/entities/scrum-task.entity';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: +configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'eduquest'),
        entities: [
          User,
          UserRole,
          Role,
          Institution,
          Student,
          Teacher,
          Grade,
          Subject,
          ThematicUnit,
          Topic,
          Competence,
          Course,
          Enrollment,
          CourseSchedule,
          Activity,
          ActivityLevel,
          ActivityCourse,
          Problem,
          AnswerOption,
          ActivityCompetence,
          Rubric,
          RubricCriterion,
          Evaluation,
          EvaluationCriterion,
          ActivityAttempt,
          AttemptResponse,
          GamificationProfile,
          PointTransaction,
          Badge,
          StudentBadge,
          CompetenceProgress,
          Report,
          Sprint,
          UserStory,
          ScrumTask,
        ],
        migrations: [
          CreateUsuarioRol1795500000000,
          MigrateLegacyUserRoles1795500000001,
          CreateRemainingEduquestTables1795541000000,
        ],
        migrationsRun: false,
        synchronize: false,
      }),
    }),
    UserModule,
    AuthModule,
    RoleModule,
    InstitutionModule,
    StudentModule,
    TeacherModule,
    GradeModule,
    SubjectModule,
    ThematicUnitModule,
    TopicModule,
    CompetenceModule,
    CourseModule,
    EnrollmentModule,
    CourseScheduleModule,
    ActivityModule,
    ActivityLevelModule,
    ActivityCourseModule,
    ProblemModule,
    AnswerOptionModule,
    ActivityCompetenceModule,
    RubricModule,
    RubricCriterionModule,
    EvaluationModule,
    EvaluationCriterionModule,
    ActivityAttemptModule,
    AttemptResponseModule,
    GamificationProfileModule,
    PointTransactionModule,
    BadgeModule,
    StudentBadgeModule,
    CompetenceProgressModule,
    ReportModule,
    SprintModule,
    UserStoryModule,
    ScrumTaskModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
