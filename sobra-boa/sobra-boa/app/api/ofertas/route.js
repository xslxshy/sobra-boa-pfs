import { tratarErros } from "../../../middlewares/erros";
import { autenticar } from "../../../middlewares/autenticar";
import { listar, criar } from "../../../controllers/ofertaController";

export const dynamic = "force-dynamic";

export const GET = tratarErros(listar);
export const POST = tratarErros(autenticar(criar, ["doador"]));
