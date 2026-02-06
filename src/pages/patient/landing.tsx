import { useInView } from "react-intersection-observer";
import { Typewriter } from "react-simple-typewriter";
import { users, type Iuser } from "./communityUsers";
import Header from "../../components/LandingHeader";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="bg-off-white w-full h-auto flex items-center flex-col ">
        <Main />
        <Section2
          id={2}
          section="services"
          title="Our Available Services"
          desc=""
          radiusTop="border-t border-t-zinc-300 lg:rounded-t-[100px] shadow-primary"
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
    <main className="flex flex-col lg:flex-row justify-center items-center min-h-screen lg:w-custom lg:h-custom relative overflow-hidden px-5 lg:px-5 py-10 lg:py-0">
      <div className="flex justify-center items-center flex-col w-full lg:w-auto z-40 mb-8 lg:mb-0">
        <div className="flex gap-2 items-center rounded-full border-primary border px-3 py-0.5 bg-gradient-radial">
          <img src="/assets/icons/logo.png" className="w-6" alt="OMDL Logo" />
          <h1 className="text-base lg:text-lg font-sans text-zinc-700 ">
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
        <h1 className="text-transparent font-semibold text-3xl lg:text-5xl w-full lg:w-4/6 text-center self-center font-manrope bg-clip-text bg-linear-to-b via-zinc-700 from-zinc-950 to-zinc-400 p-3">
          Olympus Medical and Diagnostic Laboratory
        </h1>
        <p className="text-zinc-800 mt-5 w-full lg:w-3/6 text-sm font-manrope text-center tracking-wider px-4 lg:px-0">
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

      <aside className="z-40 w-full lg:w-auto">
        <ImageCarousel />
      </aside>
      <div className="z-1 w-[1500px] h-[1500px] bg-custom-radial absolute rounded-full top-32"></div>
    </main>
  );
}

function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      title: "Welcome to OMDL",
      image: "/assets/images/landing-bg.png",
    },
    {
      title: "Our Vision",
      image: "/assets/images/vision.png",
    },
    {
      title: "Our Mission",
      image: "/assets/images/mission.png",
    },
    {
      title: "Our Goals",
      image: "/assets/images/goal.png",
    },
    {
      title: "Our Values",
      image: "/assets/images/visual.png",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div className="relative w-full lg:w-[40vw] h-[350px] lg:h-[500px]">
      {/* Carousel Container */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl lg:rounded-3xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/40 to-transparent p-4 lg:p-6">
                <h2 className="font-manrope text-xl lg:text-2xl font-bold text-white">
                  {slide.title}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 lg:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 lg:p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-4 h-4 lg:w-5 lg:h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 lg:p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-4 h-4 lg:w-5 lg:h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 lg:gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-white w-6 lg:w-8 h-2 lg:h-2.5"
                : "bg-white/50 hover:bg-white/80 w-2 lg:w-2.5 h-2 lg:h-2.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
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
          alt={name}
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
