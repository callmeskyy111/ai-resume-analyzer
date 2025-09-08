import React, { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

export const meta = () => [
  { title: "ResuMind | Upload File 📂" },
  {
    name: "description",
    content: "Upload Your Resume",
  },
];

function Upload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusTxt, setStatusTxt] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleFileSelect(file: File | null) {
    setFile(file);
  }

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const form: HTMLFormElement | null = evt.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name");
    const jobTitle = formData.get("job-title");
    const jobDescription = formData.get("job-description");

    console.log({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1 className="">Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusTxt}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <>
              <h2>Drop your resumes for an ATS Score and improvement tips.</h2>
            </>
          )}
          {!isProcessing && (
            <form
              action=""
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Company name.."
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Job Title.."
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Job Description.."
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default Upload;
