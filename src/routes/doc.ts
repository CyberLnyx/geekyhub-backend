import multer from "multer";
import { routerCreator } from "../helpers";
import { uploadDocument } from "../controllers";

// create an instance of a router
const docRouter = routerCreator();

// create a parser than can parse form-data
const upload = multer();

docRouter.post("/upload", upload.array("documents"), uploadDocument);

export default docRouter;
