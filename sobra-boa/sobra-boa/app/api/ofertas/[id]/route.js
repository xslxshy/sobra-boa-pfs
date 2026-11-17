import { tratarErros } from "../../../../middlewares/erros";
import { autenticar } from "../../../../middlewares/autenticar";
import { mudarStatus, remover } from "../../../../controllers/ofertaController";

export const dynamic = "force-dynamic";

export const PATCH = tratarErros(autenticar(mudarStatus));
export const DELETE = tratarErros(autenticar(remover, ["doador"]));
