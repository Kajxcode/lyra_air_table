"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { House, LucideHouse } from "lucide-react";

type Base = RouterOutputs["base"]["getAll"][number];

export default function BasesPage() {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: bases, isLoading, isRefetching } = api.base.getAll.useQuery();

  const createBase = api.base.create.useMutation({
    onSuccess: async (base) => {
      await utils.base.getAll.invalidate();
      router.push(`/bases/${base.id}`);
    },
  });

  const updateBase = api.base.update.useMutation({
    onSuccess: async () => {
      await utils.base.getAll.invalidate();
    },
  });

  const [newBaseName, setNewBaseName] = useState("");
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const filteredBases = useMemo(() => {
    if (!bases) return [];
    const term = filter.trim().toLowerCase();
    if (!term) return bases;
    return bases.filter((base) => base.name.toLowerCase().includes(term));
  }, [bases, filter]);

  const handleCreate = () => {
    const value = newBaseName.trim();
    if (!value) return;
    createBase.mutate({ name: value });
    setNewBaseName("");
  };

  const startEditing = (base: Base) => {
    setEditingId(base.id);
    setEditingName(base.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = () => {
    if (!editingId) return;
    const name = editingName.trim();
    if (!name) return;
    updateBase.mutate({ id: editingId, name });
  };

  const formatDate = (date?: Date) =>
    date
      ? date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "—";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading bases...
      </div>
    );
  }

  return (
  <div className="min-h-screen flex bg-[#f7f7f7] text-gray-900">

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Workspace</p>
                <h1 className="font-bold text-3xl">Bases</h1>
              </div>
              <div className="flex items-center gap-3">
                <input
                  placeholder="Name your base"
                  value={newBaseName}
                  onChange={(e) => setNewBaseName(e.target.value)}
                  className="border rounded-lg border-gray-300 px-3 py-2 text-sm bg-white"
                />
                <button
                  onClick={handleCreate}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-60"
                  disabled={createBase.isPending}
                >
                  Create base
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Start fresh</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Spin up a new base and organize your tables.
                </p>
                <div className="flex gap-2">
                  <input
                    placeholder="Base name"
                    value={newBaseName}
                    onChange={(e) => setNewBaseName(e.target.value)}
                    className="flex-1 border rounded-lg border-gray-300 px-3 py-2 text-sm bg-gray-50"
                  />
                  <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-60"
                    disabled={createBase.isPending}
                  >
                    Create
                  </button>
                </div>
                {createBase.isPending && (
                  <p className="text-xs text-blue-600 mt-2">
                    Creating your base...
                  </p>
                )}
              </div>

              {filteredBases.map((base) => (
                <div
                  key={base.id}
                  className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    {editingId === base.id ? (
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Base
                        </p>
                        <h3 className="font-semibold text-xl line-clamp-1">
                          {base.name}
                        </h3>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">
                      Updated {formatDate(base.updatedAt)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    Created {formatDate(base.createdAt)}
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    {editingId === base.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-500 disabled:opacity-60"
                          disabled={updateBase.isPending}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => router.push(`/bases/${base.id}`)}
                          className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-900"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => startEditing(base)}
                          className="px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white hover:bg-gray-50"
                        >
                          Rename
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredBases.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                <p className="text-lg font-medium mb-2">
                  {filter
                    ? "No bases match that search"
                    : "No bases yet. Create your first one to get started."}
                </p>
                {!filter && (
                  <button
                    onClick={handleCreate}
                    className="text-blue-600 hover:underline text-sm"
                    disabled={createBase.isPending}
                  >
                    Create a base
                  </button>
                )}
              </div>
            )}

            {isRefetching && (
              <div className="text-sm text-gray-500">Refreshing bases...</div>
            )}
          </div>
        </main>
      </div>
  );
}
