import { tratarErros } from "../../../middlewares/erros";
import { cadastro } from "../../../controllers/authController";

export const dynamic = "force-dynamic";

export const POST = tratarErros(cadastro);
