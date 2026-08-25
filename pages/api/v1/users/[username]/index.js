import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import { ForbiddenError } from "infra/errors";

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

  const userFound = await user.findOneByUsername(username);

  if (userFound.id !== request.context.user.id) {
    throw new ForbiddenError({
      message: "Você não tem permissão para alterar este usuário.",
      action: "Verifique suas credenciais e tente novamente.",
    });
  }

  const updatedUser = await user.update(username, userInputValues);
  return response.status(200).json(updatedUser);
}
