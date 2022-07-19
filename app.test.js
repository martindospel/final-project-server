const server = require('./app');
const { Student } = require('./db');
const supertest = require('supertest');
const request = supertest(server);

describe('/api/students endpoints work correctly', () => {
  const student = {
    studentName: 'Doe',
    dob: '2022.01.02',
    classUuid: '1',
    gender: 'male',
  };
  const timelineData = {
    present: true,
    goodPerf: true,
    goodBehave: true,
    perfComment: 'performance comment',
    behaveComment: 'behviour comment',
  };

  const deleteDoe = async () => {
    await Student.deleteOne(student);
  };

  afterEach(async () => {
    await deleteDoe();
  })

  test('The test file is working fine...', done => {
    request
      .get('/')
      .expect(200)
      .then(res => {
        expect(res.text).toBe('Server is listening...');
        done();
      })
      .catch(err => done(err));
  });
  test('Make one student => POST /api/students', done => {
    request
      .post('/api/students')
      .send(student)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body.studentName).toBe(student.studentName);
        expect(res.body.dob).toBe(student.dob);
        expect(res.body.classUuid).toBe(student.classUuid);
        expect(res.body.gender).toBe(student.gender);
        expect(res.body.uuid).not.toBeNull();
        done();
      })
      .catch(err => done(err));
  });
  test('Get one student => GET /api/students/:uuid', done => {
    request
      .post('/api/students')
      .send(student)
      .then(res => {
        request
          .get(`/api/students/${res.body.uuid}`)
          .expect(200)
          .then(getRes => {
            expect(getRes.body.studentName).toBe(student.studentName);
            expect(getRes.body.dob).toBe(student.dob);
            expect(getRes.body.classUuid).toBe(student.classUuid);
            expect(getRes.body.gender).toBe(student.gender);
            expect(getRes.body.uuid).toBe(res.body.uuid);
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
  test('Add to student\'s timeline => POST /api/students/:uuid', done => {
    request
      .post('/api/students')
      .send(student)
      .then(res => {
        request
          .post('/api/students/' + res.body.uuid)
          .send(timelineData)
          .expect(200)
          .then(tRes => {
            const responseTimelineData = tRes.body.assessments[tRes.body.assessments.length - 1];
            expect(responseTimelineData.present).toBe(timelineData.present);
            expect(responseTimelineData.goodPerf).toBe(timelineData.goodPerf);
            expect(responseTimelineData.goodBehave).toBe(timelineData.goodBehave);
            expect(responseTimelineData.perfComment).toBe(timelineData.perfComment);
            expect(responseTimelineData.behaveComment).toBe(timelineData.behaveComment);
            expect(responseTimelineData.uuid).not.toBeNull();
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
  test.todo('Update student\'s timeline => PATCH /api/students/:studentUuid/:timelineUuid');
});

describe('/api/classes endpoints work correctly', () => {
  test.todo('Get one class => GET /api/classes/1');
  test.todo('Add one student to class => POST /api/students/1')
});