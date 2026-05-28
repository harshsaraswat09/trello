import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DashboardLayout,
  PageHeader,
  TaskCard,
} from "../components/DashboardComponents";
import { getBoardById, getCardsByList, getListsByBoard } from "../services/dashboard.api";
import { toBoardCard, toKanbanColumn } from "../services/dashboard.transforms";

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBoard() {
      try {
        const boardData = await getBoardById(boardId);
        const lists = await getListsByBoard(boardId);
        const cardGroups = await Promise.all(
          lists.map(async (list) => {
            const cards = await getCardsByList(list._id || list.id);
            return toKanbanColumn(list, cards);
          })
        );

        if (mounted) {
          setBoard(
            toBoardCard(
              {
                ...boardData,
                listCount: lists.length,
                cardCount: cardGroups.reduce((sum, item) => sum + item.tasks.length, 0),
              },
              "Workspace"
            )
          );
          setColumns(cardGroups);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBoard();

    return () => {
      mounted = false;
    };
  }, [boardId]);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow={board?.workspace}
        title={board?.title || "Board"}
        description={`${board?.lists || 0} lists, ${board?.cards || 0} cards, ${board?.progress || 0}% complete.`}
        action={
          <Link
            to="/boards"
            className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100"
          >
            Back to Boards
          </Link>
        }
      />
      {loading && (
        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          Loading board from backend...
        </div>
      )}
      <section className="grid gap-4 overflow-x-auto pb-3 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[260px] rounded-2xl bg-slate-100 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800">{column.title}</h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500">
                {column.tasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            <button className="mt-3 w-full rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm font-black text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
              + Add Card
            </button>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
}
