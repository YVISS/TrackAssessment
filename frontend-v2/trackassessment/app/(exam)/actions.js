'use server'

import { redirect } from "next/navigation";
import { createActionClient } from "../../utils/supabase/actions";
import { revalidatePath } from "next/cache";

export async function submitExamAnswers(answersData) {
    const supabase = await createActionClient();
    const {data: { user }} = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // You can store the exam results in a separate table if needed
    // For example, create an "ExamResults" table with columns:
    // user_id, score, total_questions, correct_answers, submitted_at, answers (JSONB)
    
    try {
        const { error } = await supabase.from('ExamResults').insert([{
            user_id: user.id,
            score: answersData.score,
            total_questions: answersData.total,
            correct_answers: answersData.correct,
            answers: answersData.answers,
            submitted_at: new Date().toISOString()
        }]);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath('/take');
        return { success: true };
    } catch (error) {
        console.error('Error submitting exam:', error);
        return { success: false, error: error.message };
    }
}

export async function getQuestions() {
    const supabase = await createActionClient();
    const {data: { user }} = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data, error } = await supabase
        .from('EntrepreneurshipTest')
        .select('number, Questions, A, B, C, D, Answers')
        .order('number', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}
