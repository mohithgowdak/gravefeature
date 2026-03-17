interface LessonLearnedProps {
  lesson: string;
}

export function LessonLearned({ lesson }: LessonLearnedProps) {
  return (
    <aside className="fixed bottom-6 left-6 z-40 max-w-xs rotate-[-2deg] border-[3px] border-black bg-[#FEF08A] p-4 text-black shadow-brutal">
      <p className="text-[10px] font-black uppercase text-black">Crucial Lesson</p>
      <p className="mt-1 text-sm font-bold text-black">{lesson}</p>
    </aside>
  );
}
