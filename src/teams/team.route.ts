import { Router } from 'express';
import TeamController from './team.controller';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { CreateTeamSchema, TeamIdSchema, UpdateTeamSchema } from './team.schema';
import { teamService } from '../core/dependecies';
const teamRouter = Router();

const teamController = new TeamController(teamService);
// Get all teams
teamRouter.get('/teams/all', teamController.getAllTeams);

// Get teams paginated
teamRouter.get('/teams', teamController.getTeams);

// Get a Team
teamRouter.get(
  '/teams/:teamId',
  validate(TeamIdSchema),
  ValidateIdMiddleware.validateParamsId,
  teamController.getTeam,
);

// Create a Team
teamRouter.post('/team', validate(CreateTeamSchema), teamController.createTeam);

// Delete a Team
teamRouter.delete(
  '/teams/:teamId',
  validate(TeamIdSchema),
  ValidateIdMiddleware.validateParamsId,
  teamController.deleteTeam,
);

// Update a Team
teamRouter.patch(
  '/teams/:teamId',
  validate(UpdateTeamSchema),
  ValidateIdMiddleware.validateParamsId,
  teamController.updateTeam,
);

export default teamRouter;
