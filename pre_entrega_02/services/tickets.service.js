import { Tickets as DAO } from "../DAO/factory.js"; 

class TicketsService {
    constructor(dao) {
        this.dao = new dao();
    }

    async createTicket(ticket) {
        return await this.dao.create(ticket);
    }

}

export const ticketsService = new TicketsService(DAO);