import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/app.setup';

type IdBody = { id: string };

describe('Cinema API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('film -> hall -> showing -> booking flow', async () => {
    const server = app.getHttpServer();

    const film = await request(server)
      .post('/films')
      .send({ title: 'Земля', durationMinutes: 75, releaseYear: 1930 })
      .expect(201);
    const filmId = (film.body as IdBody).id;

    const hall = await request(server)
      .post('/halls')
      .send({ name: 'Зал 1', rows: 3, seatsPerRow: 5 })
      .expect(201);
    const hallId = (hall.body as IdBody).id;

    await request(server)
      .post('/halls')
      .send({ name: 'Зал 1', rows: 1, seatsPerRow: 1 })
      .expect(409);

    const hallWithSeats = await request(server)
      .get(`/halls/${hallId}`)
      .expect(200);
    expect((hallWithSeats.body as { seats: unknown[] }).seats).toHaveLength(15);

    const showing = await request(server)
      .post('/showings')
      .send({ filmId, hallId, startsAt: '2030-01-15T18:00:00Z', price: 12500 })
      .expect(201);
    const showingId = (showing.body as IdBody).id;
    expect(showing.body).toMatchObject({
      filmTitle: 'Земля',
      hallName: 'Зал 1',
    });

    await request(server)
      .post('/showings')
      .send({ filmId, hallId, startsAt: '2020-01-15T18:00:00Z', price: 12500 })
      .expect(400);

    await request(server).delete(`/films/${filmId}`).expect(409);

    const booking = await request(server)
      .post(`/showings/${showingId}/bookings`)
      .send({
        seats: [
          { row: 1, seat: 1 },
          { row: 1, seat: 2 },
        ],
      })
      .expect(201);
    expect((booking.body as { totalPrice: number }).totalPrice).toBe(25000);

    await request(server)
      .post(`/showings/${showingId}/bookings`)
      .send({
        seats: [
          { row: 2, seat: 1 },
          { row: 2, seat: 1 },
        ],
      })
      .expect(400);

    await request(server)
      .post(`/showings/${showingId}/bookings`)
      .send({
        seats: [
          { row: 1, seat: 3 },
          { row: 1, seat: 2 },
        ],
      })
      .expect(409);

    await request(server)
      .delete(`/bookings/${(booking.body as IdBody).id}`)
      .expect(204);

    const seats = await request(server)
      .get(`/showings/${showingId}/seats`)
      .expect(200);
    expect(
      (seats.body as { isBooked: boolean }[]).every((s) => !s.isBooked),
    ).toBe(true);
  });
});
