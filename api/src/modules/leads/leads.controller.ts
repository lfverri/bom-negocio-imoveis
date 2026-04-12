import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateLeadActivityDto } from "./dto/create-lead-activity.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";
import { LeadsService } from "./leads.service";

@Controller("leads")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "MANAGER", "AGENT", "VIEWER")
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  list(@Query() query: QueryLeadsDto) {
    return this.leads.list(query);
  }

  @Get(":id")
  getById(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.leads.getById(id);
  }

  @Roles("ADMIN", "MANAGER", "AGENT")
  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leads.create(dto);
  }

  @Roles("ADMIN", "MANAGER", "AGENT")
  @Patch(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateLeadDto,
    @Req() req: { user?: { sub?: string } },
  ) {
    return this.leads.update(id, dto, req.user?.sub ?? "");
  }

  @Roles("ADMIN", "MANAGER")
  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.leads.remove(id);
  }

  @Get(":id/activities")
  listActivities(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.leads.listActivities(id);
  }

  @Roles("ADMIN", "MANAGER", "AGENT")
  @Post(":id/activities")
  createActivity(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateLeadActivityDto,
  ) {
    return this.leads.createActivity(id, req.user?.sub ?? "", dto);
  }

  @Get(":id/status-history")
  listStatusHistory(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.leads.listStatusHistory(id);
  }

  @Roles("ADMIN", "MANAGER", "AGENT")
  @Post(":id/status-history")
  transitionStatus(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Req() req: { user?: { sub?: string } },
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leads.transitionStatus(id, req.user?.sub ?? "", dto);
  }
}
