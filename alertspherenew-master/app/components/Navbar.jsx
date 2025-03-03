

export default function Navbar(){

    return (
        <nav className="flex justify-between px-5 bg-[#27343b] text-white py-8">
            <div className="font-bold text-3xl">ALERT-SPHERE</div>

            <div className="flex gap-6 font-semibold text-xl">
                <a href="#realtime">REAL-TIME DISASTERS</a>
                <a href="#predicted">UPCOMING DISASTERS</a>
                <a href="#emergency">EMERGENCY CONTACTS</a>
                <a href="/safety">SAFETY MEASURES</a>
            </div>
        </nav>
    )

}