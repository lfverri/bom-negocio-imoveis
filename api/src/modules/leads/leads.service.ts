import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LeadsRepository } from "./leads.repository";
import { CreateLeadActivityDto } from "./dto/create-lead-activity.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";

@Injectable()
export class LeadsService {
  constructor(private readonly repo: LeadsRepository) {}

  list(query: QueryLeadsDto) {
    return this.repo.list(query);
  }

  async getById(id: string) {
    const lead = await this.repo.findOneById(id);
    if (!lead) throw new NotFoundException("Lead not found");
    return lead;
  }

  create(dto: CreateLeadDto) {
    return this.repo.createLead(dto);
  }

  async update(id: string, dto: UpdateLeadDto, actorId: string) {
    if (!actorId) {
      throw new UnauthorizedException("Missing authenticated user");
    }

    const current = await this.repo.findOneById(id);
    if (!current) throw new NotFoundException("Lead not found");

    const updated = await this.repo.updateLead(id, dto);
    if (dto.status && dto.status !== current.status) {
      await this.repo.transitionStatus(id, actorId, {
        status: dto.status,
        reason: "Status updated via lead PATCH",
      });
      return this.getById(id);
    }

    return updated;
  }

  async remove(id: string) {
    const current = await this.repo.findOneById(id);
    if (!current) throw new NotFoundException("Lead not found");
    return this.repo.deleteLead(id);
  }

  async listActivities(leadId: string) {
    await this.getById(leadId);
    return this.repo.listActivities(leadId);
  }

  async createActivity(
    leadId: string,
    userId: string,
    dto: CreateLeadActivityDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException("Missing authenticated user");
    }

    await this.getById(leadId);
    return this.repo.createActivity(leadId, userId, dto);
  }

  async listStatusHistory(leadId: string) {
    await this.getById(leadId);
    return this.repo.listStatusHistory(leadId);
  }

  async transitionStatus(
    leadId: string,
    userId: string,
    dto: UpdateLeadStatusDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException("Missing authenticated user");
    }

    const updated = await this.repo.transitionStatus(leadId, userId, dto);
    if (!updated) throw new NotFoundException("Lead not found");
    return updated;
  }
}
