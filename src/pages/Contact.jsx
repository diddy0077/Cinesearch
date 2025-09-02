// src/pages/Contact.jsx
import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";



export default function Contact({currentUser}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); 

  function validate() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      return "Please fill in name, email and message.";
    }
   
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Please enter a valid email address.";
    if (message.trim().length < 10) return "Message must be at least 10 characters.";
    return null;
  }

  async function handleSend(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ type: "error", msg: err });
      setTimeout(() => setStatus(null), 3500);
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      // === OPTION A: Send via your backend (recommended) ===
      // Replace /api/contact with your server endpoint or Firebase Function
      const res = await fetch("https://formspree.io/f/xrbayzee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) throw new Error("Failed to send. Try again later.");

      setStatus({ type: "success", msg: "Message sent — we’ll get back to you soon!" });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: err.message || "Sending failed." });
    } finally {
      setSending(false);
      setTimeout(() => setStatus(null), 5000);
    }

  }

  return (
    <>
      <Navbar2 currentUser={currentUser}/>
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">Contact CineSearch</h1>
          <p className="text-gray-300 mt-2">
            Questions, feedback, or feature requests — drop us a message and we’ll reply ASAP.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact form */}
          <form
            onSubmit={handleSend}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg"
            aria-label="Contact form"
          >
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-sm text-gray-300">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-300">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-300">Subject (optional)</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  type="text"
                  placeholder="Feature request, bug report..."
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-300">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="Tell us what’s up..."
                  required
                />
              </label>

              {status && (
                <div
                  role="status"
                  className={`px-3 py-2 rounded ${status.type === "success" ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"}`}
                >
                  {status.msg}
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 transition font-semibold cursor-pointer"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>

                <button
                  type="button"
                  onClick={() => { setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                  className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition text-white cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>

          {/* Side info / contact details */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-gray-800 shadow-lg">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Other ways to reach us</h3>

              <p className="text-gray-300 mb-4">
                Prefer email? Send to <a className="text-red-400 hover:underline" href="mailto:hello@cinesearch.app">hello@cinesearch.app</a>
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm text-gray-400">Support</h4>
                  <p className="text-white">support@cinesearch.app</p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-400">Partnerships</h4>
                  <p className="text-white">partners@cinesearch.app</p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-400">Follow</h4>
                  <div className="flex gap-3 mt-2">
                    <a href="#" className="text-gray-300 hover:text-red-400">Twitter</a>
                    <a href="https://www.linkedin.com/in/daniel-udeh-a03971350/" className="text-gray-300 hover:text-indigo-400">LinkedIn</a>
                    <a href="https://github.com/diddy0077" className="text-gray-300 hover:text-gray-100">GitHub</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              <p>We aim to reply within 24–48 hours.</p>
              <p className="mt-3">By sending a message you agree to our <a className="text-red-400 hover:underline" href="/privacy">Privacy Policy</a>.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
      </>
  );
}
