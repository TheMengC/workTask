
import store from "@/store";
export default function checkSymbol(content) {
    const user = store.getters.user;
    if (content.indexOf("@" + user.name) > -1) {
        return true;
    }
    return false;
}
