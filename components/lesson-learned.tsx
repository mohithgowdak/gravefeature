interface LessonLearnedProps {
  lesson: string;
}

export function LessonLearned({ lesson }: LessonLearnedProps) {
  return (
    <aside className="relative z-10 mt-2 w-full max-w-none rotate-0 border-[3px] border-black bg-[#FEF08A] p-4 text-black shadow-brutal lg:fixed lg:bottom-6 lg:left-6 lg:z-40 lg:max-w-xs lg:rotate-[-2deg]">
      <p className="text-[10px] font-black uppercase text-black">Crucial Lesson</p>
      <p className="mt-1 text-sm font-bold text-black">{lesson}</p>
    </aside>
  );
}
