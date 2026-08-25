import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import { ForbiddenError } from "infra/errors";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:user"), getHandler);
router.patch(controller.canRequest("update:user"), patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { username } = request.query;

  const userFound = await user.findOneByUsername(username);
  return response.status(200).json(userFound);
}

async function patchHandler(request, response) {
  const { username } = request.query;
  const userInputValues = request.body;

  const userTryingToPatch = request.context.user;
  const targetUser = await user.findOneByUsername(username);

  if (!authorization.can(userTryingToPatch, "update:user", targetUser)) {
    throw new ForbiddenError({
      message: "Você não possui permissão para alterar outro usuário.",
      action:
        "Verifique se você possui a feature necessária para atualizar outro usuário.",
    });
  }

  const updatedUser = await user.update(username, userInputValues);
  return response.status(200).json(updatedUser);
}
