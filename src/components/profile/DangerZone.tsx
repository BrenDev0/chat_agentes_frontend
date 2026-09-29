import { useState } from "react";
import { FaSpinner, FaUserSlash } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import ConfirmDeleteAccount from "../ui/ConfirmDeleteAccount";
import { useRouter } from "next/navigation";

export default function DangerZone() {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setErrorRequest(null);
  };

  const confirmDelete = async (word: string) => {
    try {
      const validateWord = word == "ELIMINAR CUENTA";

      if (!validateWord) {
        setErrorRequest("La frase no es correcta, intente nuevamente");
        return;
      }

      setErrorRequest(null);
      setLoading(true);
      const res = await fetch(`/api/deleteAccount/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (!res.ok) {
        setErrorRequest(result.message);
        setLoading(false);
        // closeDeleteModal();
        return;
      }
      setLoading(false);
      setDeleteSuccess(true);
      setTimeout(() => {
        closeDeleteModal();
        setDeleteSuccess(false);
        router.push("/");
      }, 3000);
      //   router.refresh();
    } catch (err) {
      setErrorRequest("Ocurrio un error,contacte al administrador");
    }
  };
  return (
    <div className="bg-red-50/30 dark:bg-red-950/10 p-8 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/30 space-y-6 transition-colors">
      {isDeleteModalOpen && (
        <ConfirmDeleteAccount
          closeDeleteModal={closeDeleteModal}
          confirmDelete={confirmDelete}
          isDeleting={loading}
          errorMsg={errorRequest}
          deleteStatus={deleteSuccess}
        />
      )}
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <IoWarningOutline
          size={20}
          className="text-red-600 dark:text-red-400"
        />
        Zona de Peligro
      </h3>
      <p className="text-xs text-red-600 leading-relaxed">
        Al eliminar tu cuenta, todos tus agentes, bases de conocimiento e
        historial serán borrados de forma permanente. Esta acción no se puede
        deshacer.
      </p>
      <div className="space-y-4">
        <button
          onClick={openDeleteModal}
          type="button"
          className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all bg-red-600 text-white hover:bg-red-400 shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 disabled:opacity-50 disabled:scale-100`}
        >
          <FaUserSlash size={18} />
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
}
