import { ActivityCourseController } from './activity-course.controller';
import { ActivityCourseService } from './activity-course.service';

describe('ActivityCourseController', () => {
  it('forwards student availability queries', () => {
    const response = Promise.resolve({ data: [], total: 0 });
    const findAvailableForStudent = jest.fn().mockReturnValue(response);
    const service = {
      findAvailableForStudent,
    } as unknown as ActivityCourseService;
    const controller = new ActivityCourseController(service);
    const query = { page: 1, limit: 10 };

    expect(controller.findAvailableForStudent(7, query)).toBe(response);
    expect(findAvailableForStudent).toHaveBeenCalledWith(7, query);
  });
});
