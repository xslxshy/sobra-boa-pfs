import { tratarErros } from "../../../../middlewares/erros";
import { login } from "../../../../controllers/authController";

export const dynamic = "force-dynamic";

export const POST = tratarErros(login);
