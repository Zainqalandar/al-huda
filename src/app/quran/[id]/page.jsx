'use client';
// import Sidebar from '@/components/ui/Sidebar';
import Sidebar from "@/components/sidebar/index.jsx"
import QuranAudioBottomBar from "@/components/ui/QuranAudioUI";
import { useParams } from "next/navigation";


export default function SurahDetail() {
	 const { id } = useParams();
	return (
		<>
			<div
			className=" mt-16"
			>
				<Sidebar />
				<QuranAudioBottomBar initialSurah={id} />
			</div>
		</>
	);
}
