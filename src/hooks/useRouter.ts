import {
  NavigateOptions,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "@solidjs/router";
import { createMemo } from "solid-js";
import { joinBase, log, pathJoin, trimBase } from "~/utils";

const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  return {
    to: (
      path: string,
      ignore_root?: boolean,
      options?: Partial<NavigateOptions>
    ) => {
      if (!ignore_root && path.startsWith("/")) {
        path = joinBase(path);
      }
      log("to:", path);
      navigate(path, options);
    },
    back: () => {
      navigate(-1);
    },
    forward: () => {
      navigate(1);
    },
    pathname: createMemo(() => {
      return trimBase(location.pathname);
    }),
    searchParams: searchParams,
    setSearchParams: setSearchParams,
    params: params,
  };
};

export { useRouter };
