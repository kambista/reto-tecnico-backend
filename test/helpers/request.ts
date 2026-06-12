import { INestApplication } from "@nestjs/common";
import supertest from "supertest";

export const createRequest = (app: INestApplication, basePath: string) => {
    const agent = supertest(app.getHttpServer());

    return {
        post: (path: string) => agent.post(`${basePath}${path}`),
        get: (path: string) => agent.get(`${basePath}${path}`),
        put: (path: string) => agent.put(`${basePath}${path}`),
        delete: (path: string) => agent.delete(`${basePath}${path}`),
    }
}