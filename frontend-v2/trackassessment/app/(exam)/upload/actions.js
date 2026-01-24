'use server'

import { redirect } from "next/navigation";
import { createActionClient } from "../../../utils/supabase/actions";
import { revalidatePath } from "next/cache";

export async function uploadExam(formData) {
    const supabase = await createActionClient();
    const {data: { user }} = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const questions = String(formData.get('question') || '').trim();
    const right_answer = String(formData.get('right_answer') || '').trim();
    const answer_A = String(formData.get('answer_A') || '').trim();
    const answer_B = String(formData.get('answer_B') || '').trim();
    const answer_C = String(formData.get('answer_C') || '').trim();
    const answer_D = String(formData.get('answer_D') || '').trim();

    if(!questions || !right_answer || !answer_A || !answer_B || !answer_C || !answer_D){
        throw new Error('All fields are required');
    }

    const { error } = await supabase.from('v_IdentifyingErrors').insert([{
        questions: questions,
        right_answer: right_answer,
        answer_A: answer_A,
        answer_B: answer_B,
        answer_C: answer_C,
        answer_D: answer_D
    }])

    if (error) {
       throw new Error(error.message);
    }
    revalidatePath('/ExamUpload');
}