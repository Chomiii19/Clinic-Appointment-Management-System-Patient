import { useInView } from "react-intersection-observer";
import { Typewriter } from "react-simple-typewriter";
import { users, type Iuser } from "./communityUsers";
import Header from "../components/LandingHeader";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="bg-off-white w-full h-auto flex items-center flex-col ">
        <Main />
        <Section
          id={1}
          section="about"
          title="Effortless Clinic Appointment Features"
          desc="OMDL makes creating appointment simple"
          radiusTop="border-t border-t-zinc-300 lg:rounded-t-[100px] shadow-primary"
        />
        <Section2
          id={2}
          section="services"
          title="Our Available Services"
          desc=""
          radiusTop=""
        />
        <Community />
        <a
          href="#"
          className="font-manrope text-xl text-primary border-2 border-primary py-1 px-4 rounded-full transition-all ease-in-out duration-300 hover:border-pinkish hover:text-pinkish hover:-translate-y-1"
        >
          Book an appointment
        </a>

        <section className="w-full h-14"></section>
      </div>
    </main>
  );
}

function Main() {
  return (
    <main className="flex justify-center items-center h-screen lg:w-custom lg:h-custom relative overflow-hidden lg:px-5">
      <div className="flex justify-center items-center flex-col w-full lg:w-auto z-40">
        <div className="flex gap-2 items-center rounded-full border-primary border px-3 py-0.5 bg-gradient-radial">
          <img src="/assets/icons/logo.png" className="w-6" />
          <h1 className="text-lg font-sans text-zinc-700 ">
            <Typewriter
              words={[
                "OMDL",
                "Trusted by Patients",
                "Book Appointments with Ease",
                "Reliable Test Results",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={2500}
            />
          </h1>
        </div>
        <h1 className=" text-transparent font-semibold text-5xl w-4/6 text-center  self-center font-manrope bg-clip-text bg-linear-to-b via-zinc-700 from-zinc-950 to-zinc-400 p-3">
          Olympus Medical and Diagnostic Laboratory
        </h1>
        <p className="text-zinc-800 mt-5 w-3/6 text-sm text font-manrope text-center tracking-wider">
          Book your medical appointments quickly and easily with Olympus Medical
          and Diagnostic Laboratory.
        </p>
        <div className="mt-10 flex gap-10">
          <a
            href="/login"
            className="text-zinc-100 font-manrope px-4 py-1.5 font-semibold rounded-xl bg-linear-to-br from-blue-500 via-blue-400 to-primary hover:-translate-y-1 ease-in-out duration-300 transition-transform"
          >
            Get Started
          </a>
        </div>
      </div>

      <aside className="z-40 rounded-3xl overflow-hidden hidden lg:flex">
        <img
          src="/assets/images/landing-bg.png"
          alt="clinic"
          className="max-w-[40vw]"
        />
      </aside>
      <div className="z-1 w-[1500px] h-[1500px] bg-custom-radial absolute rounded-full top-32"></div>
    </main>
  );
}

function Section({
  title,
  desc,
  id,
  section,
  radiusTop,
}: {
  title: string;
  desc: string;
  id: number;
  section: string;
  radiusTop: string;
}) {
  const [ref, inView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`w-full h-auto rounded-[50px] flex justify-start items-center flex-col gap-11 px-8 lg:px-40 pb-44 pt-10 ${radiusTop} bg-off-white z-50 ${
        inView ? "mt-0" : "mt-44"
      } transition-all ease-in duration-500`}
    >
      <div id={section} className="flex flex-col items-center gap-3">
        <h1 className="font-manrope text-center font-semibold text-3xl lg:text-4xl text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_center,#458dfc_100%,#458dfc,#fff)] text-shadow-neon">
          {title}
        </h1>
        <p className="text-center font-manrope text-lg text-zinc-700 font-medium tracking-wider">
          {desc}
        </p>
      </div>
      <Features id={id} />
    </section>
  );
}

function Features({ id }: { id: number }) {
  const { ref: ref1, inView: isVisible1 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref2, inView: isVisible2 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref3, inView: isVisible3 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref4, inView: isVisible4 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const layout1 = id === 1 ? "lg:col-span-1" : "lg:col-span-2";
  const layout2 = id === 1 ? "lg:col-span-2" : "lg:col-span-1";

  const grid1ELementsStyle = `border bg-system-white/80 border-zinc-300 ${layout1} row-span-1 w-full h-full rounded-2xl transition-transform duration-300 ease-in shadow-md`;
  const grid2ELementsStyle = `border bg-system-white/80 border-zinc-300 ${layout2} row-span-1 w-full h-full rounded-2xl transition-transform duration-300 ease-in shadow-md`;

  return (
    <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 lg:grid-rows-2 gap-7 w-full lg:w-[1200px] h-[750px] items-center justify-center">
      <div
        ref={ref1}
        className={`overflow-hidden ${grid1ELementsStyle} ${
          isVisible1 ? "translate-x-0" : "-translate-x-7"
        }`}
      >
        <img
          src="/assets/images/vision.png"
          alt=""
          className="w-full h-full object-cover lg:object-[-15px_center]"
        />
      </div>
      <div
        ref={ref2}
        className={`overflow-hidden relative${grid2ELementsStyle} ${
          isVisible2 ? "translate-x-0" : "translate-x-7"
        }`}
      >
        <img
          src="/assets/images/mission.png"
          alt=""
          className="w-full max-w-full h-auto object-contain absolute -top-6 lg:-top-14"
        />
      </div>
      <div
        ref={ref3}
        className={`overflow-hidden ${grid2ELementsStyle} ${
          isVisible3 ? "translate-x-0" : "-translate-x-7"
        }`}
      >
        <img
          src="/assets/images/goal.png"
          alt=""
          className="w-full max-w-full h-auto object-contain absolute -top-6 lg:-top-14"
        />
      </div>
      <div
        ref={ref4}
        className={`overflow-hidden ${grid1ELementsStyle} ${
          isVisible4 ? "translate-x-0" : "translate-x-7"
        }`}
      >
        <img
          src="/assets/images/visual.png"
          alt=""
          className="w-full h-full object-cover lg:object-[-50px_center]"
        />
      </div>
    </div>
  );
}

function Section2({
  title,
  desc,
  id,
  section,
  radiusTop,
}: {
  title: string;
  desc: string;
  id: number;
  section: string;
  radiusTop: string;
}) {
  const [ref, inView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`w-full h-auto rounded-[50px] flex justify-start items-center flex-col gap-11 px-8 lg:px-40 pb-44 pt-10 ${radiusTop} bg-off-white z-50 ${
        inView ? "mt-0" : "mt-44"
      } transition-all ease-in duration-500`}
    >
      <div id={section} className="flex flex-col items-center gap-3">
        <h1 className="font-manrope text-center font-semibold text-3xl lg:text-4xl text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_center,#458dfc_100%,#458dfc,#fff)] text-shadow-neon">
          {title}
        </h1>
        <p className="text-center font-manrope text-lg text-zinc-700 font-medium tracking-wider">
          {desc}
        </p>
      </div>
      <Features2 id={id} />
    </section>
  );
}

function Features2({ id }: { id: number }) {
  const { ref: ref1, inView: isVisible1 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref2, inView: isVisible2 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref3, inView: isVisible3 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref4, inView: isVisible4 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref5, inView: isVisible5 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref6, inView: isVisible6 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref7, inView: isVisible7 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const layout2 = id === 1 ? "lg:col-span-2" : "lg:col-span-1";

  const grid2ELementsStyle = `${layout2} row-span-1 w-full h-full rounded-2xl transition-transform duration-300 ease-in flex justify-center items-center `;

  return (
    <div
      className="
  grid
  grid-cols-1
  grid-rows-7
  auto-rows-auto

  lg:grid-cols-3
  lg:grid-rows-3
  lg:auto-rows-auto

  gap-7
  w-full
  lg:w-[1000px]
  h-auto
  items-start
  justify-center
"
    >
      <div
        ref={ref1}
        className={`${grid2ELementsStyle} ${
          isVisible1 ? "translate-x-0" : "-translate-x-7"
        }`}
      >
        <img src="/assets/images/service1.png" alt="" />
      </div>
      <div
        ref={ref2}
        className={`overflow-hidden${grid2ELementsStyle} ${
          isVisible2 ? "translate-x-0" : "translate-x-7"
        }`}
      >
        <img src="/assets/images/service2.png" alt="" />
      </div>
      <div
        ref={ref3}
        className={`overflow-hidden ${grid2ELementsStyle} ${
          isVisible3 ? "translate-x-0" : "-translate-x-7"
        }`}
      >
        <img src="/assets/images/service3.png" alt="" />
      </div>
      <div
        ref={ref4}
        className={`overflow-hidden ${grid2ELementsStyle} ${
          isVisible4 ? "translate-x-0" : "translate-x-7"
        }`}
      >
        <img src="/assets/images/service4.png" alt="" />
      </div>
      <div
        ref={ref5}
        className={`overflow-hidden ${grid2ELementsStyle} ${
          isVisible5 ? "translate-x-0" : "-translate-x-7"
        }`}
      >
        <img src="/assets/images/service5.png" alt="" />
      </div>
      <div
        ref={ref6}
        className={`overflow-hidden ${grid2ELementsStyle} ${
          isVisible6 ? "translate-x-0" : "translate-x-7"
        }`}
      >
        <img src="/assets/images/service6.png" alt="" />
      </div>
      <div className="hidden lg:flex"></div>
      <div
        ref={ref7}
        className={`overflow-hidden ${grid2ELementsStyle} ${
          isVisible7 ? "translate-x-0" : "translate-x-7"
        }`}
      >
        <img src="/assets/images/service7.png" alt="" />
      </div>
      <div className="hidden lg:flex"></div>
    </div>
  );
}

function Community() {
  return (
    <section
      id="community"
      className="h-auto lg:w-custom w-full flex items-center flex-col gap-11 pb-24 px-3 overflow-hidden"
    >
      <div className="flex flex-col items-center gap-5">
        <h1 className="font-manrope font-semibold text-3xl lg:text-4xl text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_center,#458dfc_100%,#458dfc,#fff)] text-shadow-neon">
          Hear from Our Community
        </h1>
        <p className="font-manrope text-lg text-zinc-700 font-medium tracking-wider w-80 lg:w-[550px] text-center">
          See what patients are saying about their experience with our platform.
        </p>
      </div>
      <CommunityList />
    </section>
  );
}

function CommunityList() {
  return (
    <div className="grid grid-cols-2 grid-rows-z lg:grid-cols-3 lg:grid-rows-4 grid-flow-dense auto-rows-auto w-full lg:w-[1000px] lg:gap-6 gap-3">
      {users.map((user, i) => (
        <CommunityListUser
          key={`${user.username}-${user.name}-${i}`}
          name={user.name}
          username={user.username}
          comment={user.comment}
          image={`user-${i + 1}.jpeg`}
          rowSpan={user.rowSpan}
        />
      ))}
    </div>
  );
}

function CommunityListUser({ name, username, comment, image, rowSpan }: Iuser) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`h-auto flex flex-col bg-system-white/80 border 
    border-zinc-300 rounded-xl p-4 gap-3 transition-all duration-500 ease-in shadow-sm ${rowSpan} ${
        inView ? "translate-y-0 opacity-100" : "-translate-y-14 opacity-0"
      }`}
    >
      <div className="flex gap-4 items-center">
        <img
          className="w-8 lg:w-12 rounded-full"
          src={`/assets/communityUsers/${image}`}
        />
        <div>
          <h1 className="font-manrope text-xs lg:text-sm text-zinc-800 font-semibold">
            {name}
          </h1>
          <p className="font-manrope text-xs lg:text-sm text-zinc-700 ">
            {username}
          </p>
        </div>
      </div>
      <p className="font-manrope text-xs lg:text-sm text-zinc-700">{comment}</p>
    </div>
  );
}
