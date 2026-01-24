import { createClient } from "../../../utils/supabase/client";
import { redirectIfNotAuthenticated } from "../../../utils/redirectIfNotAuthenticated";
import { uploadExam } from "./actions";
import SubmitButton from "../../_components/SubmitButton";


export default async function uploadPage() {
    const user = await redirectIfNotAuthenticated();
    const supabase = await createClient();
    const { data: v_IdentifyingErrors, errors } = await supabase.from('v_IdentifyingErrors').select('id, questions, answer_A, answer_B, answer_C, answer_D, right_answer').order('id', { ascending: true });

    return (
        <div className="flex flex-col items-center justify-center w-full gap-8">
            {/* Put Tabs for each type of exam */}
            <h1>Upload Page</h1>

            <form action={uploadExam} className="flex flex-col gap-2 w-full bg-stone-600/10 rounded-xl px-8 py-4">
                {/* Number */}
                <div>
                    <label htmlFor="id" className="block text-sm text-zinc-300">
                        Number
                    </label>
                    <input
                        className="border-purple-300/30 border rounded py-2 px-4 w-35 
              focus:outline-2 focus:outline-purple-700 focus:outline-offset-2"
                        type="text"
                        name="id"
                        id="id"
                        placeholder="Enter number"
                        autoComplete="off"
                        required
                    />
                </div>


                {/* Question */}
                <div>
                    <label htmlFor="question" className="block text-sm text-zinc-300">
                        Question
                    </label>
                    <input
                        className="border-purple-300/30 border rounded py-2 px-4 w-100 
              focus:outline-2 focus:outline-purple-700 focus:outline-offset-2"
                        type="text"
                        name="question"
                        id="question"
                        placeholder="Enter question"
                        autoComplete="off"
                        required
                    />
                </div>

                {/* OPTIONS */}
                <p>Options</p>

                <div className="flex flex-row gap-2">
                    {/* Option A */}
                    <div className="flex flex-row items-center justify-start gap-2">
                        <label htmlFor="answer_A" className="block text-lg text-zinc-300">
                            A
                        </label>
                        <input
                            className="border-purple-300/30 border rounded py-2 px-4 w-full 
              focus:outline-2 focus:outline-purple-700 focus:outline-offset-2"
                            type="text"
                            name="answer_A"
                            id="answer_A"
                            placeholder="Enter option A"
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Option B */}
                    <div className="flex flex-row items-center justify-start gap-2">
                        <label htmlFor="answer_B" className="block text-lg text-zinc-300">
                            B
                        </label>
                        <input
                            className="border-purple-300/30 border rounded py-2 px-4 w-full 
              focus:outline-2 focus:outline-purple-700 focus:outline-offset-2"
                            type="text"
                            name="answer_B"
                            id="answer_B"
                            placeholder="Enter option B"
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Option C */}
                    <div className="flex flex-row items-center justify-start gap-2">
                        <label htmlFor="answer_C" className="block text-lg text-zinc-300">
                            C
                        </label>
                        <input
                            className="border-purple-300/30 border rounded py-2 px-4 w-full 
              focus:outline-2 focus:outline-purple-700 focus:outline-offset-2"
                            type="text"
                            name="answer_C"
                            id="answer_C"
                            placeholder="Enter option C"
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Option D */}
                    <div className="flex flex-row items-center justify-start gap-2">
                        <label htmlFor="answer_D" className="block text-lg text-zinc-300">
                            D
                        </label>
                        <input
                            className="border-purple-300/30 border rounded py-2 px-4 w-full 
              focus:outline-2 focus:outline-purple-700 focus:outline-offset-2"
                            type="text"
                            name="answer_D"
                            id="answer_D"
                            placeholder="Enter option D"
                            autoComplete="off"
                            required
                        />


                    </div>
                </div>
                {/* Right Answer */}
                <div className="flex flex-col gap-2 w-auto">
                    <label htmlFor="right_answer" className="text-sm text-zinc-300">
                        Right Answer
                    </label>
                    <input
                        className="border-purple-300/30 border rounded py-2 px-4 w-100 
              focus:outline-2 focus:outline-purple-700 focus:outline-offset-2"
                        type="text"
                        name="right_answer"
                        id="right_answer"
                        placeholder="Enter Letter of the Right Answer"
                        autoComplete="off"
                        required
                    />
                </div>
                <div className="flex w-full items-center justify-center">
                    <SubmitButton className="w-100" pendingText="Submitting...">Submit</SubmitButton>
                </div>
            </form>

            {errors && (
                <p className="text-red-500 mt-4">Error loading questions: {errors.message}</p>
            )}

            {!v_IdentifyingErrors?.length ? (
                <p className="mt-4">No questions uploaded yet.</p>
            ) : (
                <div>
                    <h1 className="text-xl font-semibold">Verbal Ability Questions</h1>
                    <h3>Identifying Errors</h3>
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full border border-gray-600/80 table-auto">
                            <thead>
                                <tr className=" text-stone-50">
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Question</th>
                                    <th className="px-4 py-2 text-left">Answer A</th>
                                    <th className="px-4 py-2 text-left">Answer B</th>
                                    <th className="px-4 py-2 text-left">Answer C</th>
                                    <th className="px-4 py-2 text-left">Answer D</th>
                                    <th className="px-4 py-2 text-left">Right Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {v_IdentifyingErrors.map((q) => (
                                    <tr key={q.id} className="odd:bg-stone-900/60 even:bg-stone-900/10">
                                        <td className="px-4 py-2 align-top">{q.id}</td>
                                        <td className="px-4 py-2 align-top">{q.questions}</td>
                                        <td className="px-4 py-2 align-top">{q.answer_A}</td>
                                        <td className="px-4 py-2 align-top">{q.answer_B}</td>
                                        <td className="px-4 py-2 align-top">{q.answer_C}</td>
                                        <td className="px-4 py-2 align-top">{q.answer_D}</td>
                                        <td className="px-4 py-2 align-top">{q.right_answer}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}