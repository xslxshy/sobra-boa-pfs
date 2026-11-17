import { tratarErros } from "../../../../../middlewares/erros";
import { autenticar } from "../../../../../middlewares/autenticar";
import { listarOfertas } from "../../../../../controllers/usuarioController";

export const dynamic = "force-dynamic";

export const GET = tratarErros(autenticar(listarOfertas));
