import { tratarErros } from "../../../../middlewares/erros";
import { autenticar } from "../../../../middlewares/autenticar";
import { me } from "../../../../controllers/authController";

export const dynamic = "force-dynamic";

export const GET = tratarErros(autenticar(me));
