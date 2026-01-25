import { Menu } from "lucide-react";
import { useState } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";

function PolictyTerms() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
      <Sidebar
        page="policyTerms"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="w-full h-screen flex flex-col items-center gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 lg:w-[800px] w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Policies and Terms" />
        </div>
        <div className="bg-system-white dark:bg-system-black rounded-xl w-full lg:w-[800px] p-5 flex flex-col gap-2 overflow-auto no-scrollbar">
          <section className="flex flex-col gap-3">
            <h3 className="font-bold text-lg mb-1">Privacy Policy</h3>
            <p>
              All Olympus Medical and Diagnostic Laboratory physicians,
              healthcare staff, and administrative personnel are committed to
              preserving the integrity, confidentiality, and security of
              Protected Health Information (PHI) pertaining to our patients.
            </p>
            <p>
              The purpose of this policy is to ensure that Olympus Medical and
              Diagnostic Laboratory staff have the necessary information to
              provide the highest quality medical care possible while
              safeguarding patient data in accordance with professional ethics,
              accreditation standards, and legal requirements.
            </p>
          </section>

          <section className="flex flex-col gap-3 relative">
            <h3 className="font-bold text-lg mb-1">
              Our Commitment to Privacy
            </h3>
            <p>
              Olympus Medical and Diagnostic Laboratory physicians and staff
              will:
            </p>
            <ol className="pl-6">
              <li>
                ● Adhere to the standards outlined in the Notice of Privacy
                Practices.
              </li>
              <li>
                ● Collect, use, and disclose PHI only in accordance with state
                and federal laws, and with patient consent where required.
              </li>
              <li>
                ● Never use or disclose PHI for purposes outside treatment,
                payment, and healthcare operations (TPO) without patient
                authorization (e.g., marketing, insurance applications, or
                employment).
              </li>
              <li>
                ● Use PHI only for purposes such as reminders for scheduled
                appointments, unless instructed otherwise by the patient.
              </li>
              <li>
                ● Ensure all PHI collected is accurate, timely, complete, and
                securely maintained.
              </li>
              <li>
                ● Respect the patient’s right to privacy and treat each
                individual with dignity and professionalism.
              </li>
              <li>
                ● Act as responsible custodians of information, treating all PHI
                as sensitive and confidential.
              </li>
            </ol>
          </section>

          <section className="flex flex-col gap-3 relative">
            <h3 className="font-bold text-lg mb-1">Terms and Conditions</h3>
            <p>
              By using SevenCare services, patients and users agree to the
              following terms and conditions:
            </p>
            <ol className="pl-6">
              <li>1. Use of Services</li>
              <ol className="pl-6">
                <li>
                  ● SevenCare provides medical consultation, appointment
                  scheduling, and patient care services.
                </li>
                <li>
                  ● Patients must provide accurate personal and health
                  information to ensure quality care.
                </li>
              </ol>

              <li>2. Confidentiality of Records</li>
              <ol className="pl-6">
                <li>
                  ● All patient information is handled in compliance with
                  applicable privacy laws.
                </li>
                <li>
                  ● SevenCare reserves the right to use anonymized data for
                  research, reporting, and service improvement.
                </li>
              </ol>

              <li>3. Appointments and Cancellations</li>
              <ol className="pl-6">
                <li>
                  ● Patients are responsible for attending scheduled
                  appointments or notifying the clinic at least 24 hours in
                  advance for cancellations.
                </li>
                <li>
                  ● Repeated missed appointments may result in rescheduling
                  limitations.
                </li>
              </ol>

              <li>4. Patient Responsibilities</li>
              <ol className="pl-6">
                <li>
                  ● Patients must provide truthful and complete medical
                  histories.
                </li>
                <li>
                  ● Patients agree to follow medical advice and treatment plans
                  for best outcomes.
                </li>
              </ol>

              <li>5. Limitations of Liability</li>
              <ol className="pl-6">
                <li>
                  ● SevenCare strives to provide the best medical services but
                  does not guarantee specific outcomes.
                </li>
                <li>
                  ● SevenCare shall not be held liable for circumstances beyond
                  reasonable control, such as third-party service interruptions.
                </li>
              </ol>

              <li>6. Amendments</li>
              <ol className="pl-6">
                <li>
                  ● SevenCare reserves the right to update or revise this
                  Privacy Policy and Terms & Conditions at any time, with notice
                  provided through official channels.
                </li>
              </ol>
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PolictyTerms;
