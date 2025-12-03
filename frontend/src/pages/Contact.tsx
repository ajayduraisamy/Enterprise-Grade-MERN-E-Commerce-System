export default function Contact() {

    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">

            {/* LEFT INFO */}
            <div className="space-y-4">

                <h2 className="text-3xl font-bold text-dark">
                    Get in Touch
                </h2>

                <p className="text-gray-600">
                    Have questions, business inquiries, or need support?
                    Fill out the form and our team will get back to you as soon as possible.
                </p>

                <ul className="space-y-2 text-gray-700">
                    <li>
                        📧 Email:
                        <span className="ml-2 text-accent">support@drnexgen.com</span>
                    </li>

                    <li>
                        📞 Phone:
                        <span className="ml-2 text-accent">+91 98765 43210</span>
                    </li>

                    <li>
                        📍 Location:
                        <span className="ml-2 text-accent">India</span>
                    </li>
                </ul>

            </div>

            {/* RIGHT FORM */}
            <div>

                <form
                    action="https://formsubmit.co/ajayduraisamy@gmail.com"
                    method="POST"
                    className="space-y-4 bg-white shadow-md p-6 rounded-xl"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        className="border w-full p-2 rounded"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        required
                        className="border w-full p-2 rounded"
                    />

                    <textarea
                        name="message"
                        placeholder="Your message..."
                        rows={4}
                        required
                        className="border w-full p-2 rounded"
                    />

                    {/* Hidden config */}
                    <input type="hidden" name="_subject" value="New Contact Message - DRNEXGEN" />

                    <button
                        type="submit"
                        className="bg-brand hover:bg-blue-700 transition text-white px-5 py-2 rounded-md"
                    >
                        Send Message
                    </button>

                </form>

            </div>

        </div>
    );
}
