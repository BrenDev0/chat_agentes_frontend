import { FaUsers } from "react-icons/fa";
import KpiCard from "./kpi/KpiCard";
import { MdChatBubbleOutline } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FiActivity } from "react-icons/fi";

export default function KpiDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 mt-10">
      <KpiCard
        title="Usuarios totales"
        value="2,543"
        color="bg-indigo-600 text-white"
      >
        <FaUsers />
      </KpiCard>
      <KpiCard
        title="Mensajes IA"
        value="2,543"
        color="bg-violet-600 text-white"
      >
        <MdChatBubbleOutline />
      </KpiCard>
      <KpiCard
        title="Latencia Media"
        value="2,543"
        color="bg-amber-500 text-white"
      >
        <AiOutlineThunderbolt />
      </KpiCard>
      <KpiCard
        title="Disponibilidad"
        value="2,543"
        color="bg-emerald-500 text-white"
      >
        <FiActivity />
      </KpiCard>
    </div>
  );
}
