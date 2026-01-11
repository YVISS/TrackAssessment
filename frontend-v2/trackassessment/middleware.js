import { updateSesssion } from "./utils/supabase/middleware";

export async function middleware(request) {
    return updateSesssion(request)
}

export const config = {
    matcher:['/(.*)']
};