import routes from "@constants/router";
import { router } from "expo-router";

export const NavigationUtil = {
    goBackOrHome: () => {
        const canGoBack = router.canGoBack();
        if (canGoBack) {
            router.back();
        } else {
            router.replace(routes.home);
        }
    },
}
