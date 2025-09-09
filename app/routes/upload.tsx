import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdfToImage";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

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
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  function handleFileSelect(file: File | null) {
    setFile(file);
  }

  async function handleAnalyze({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) {
    setIsProcessing(true);
    setStatusTxt("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusTxt("🔴ERROR: Failed to upload file!");

    setStatusTxt("Converting to image.. ");
    const imgFile = await convertPdfToImage(file);
    if (!imgFile.file)
      return setStatusTxt("🔴ERROR: Failed to convert PDF to IMAGE");

    setStatusTxt("Uploading the image.. ⌛");
    const uploadedImage = await fs.upload([imgFile.file]);

    if (!uploadedImage) return setStatusTxt("🔴ERROR: Failed to upload IMAGE");

    setStatusTxt("Preparing data... ⌛");

    const uuid = generateUUID();

    // formatting the data
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusTxt("Analyzing... 🧠");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) return setStatusTxt("🔴 ERROR: Failed to analyze resume");

    const feedbackTxt =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackTxt);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusTxt("Analysis complete. Redirecting... ✅");
    console.log(data);

    navigate(`/resume/${uuid}`);
  }

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const form: HTMLFormElement | null = evt.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    // console.log({
    //   companyName,
    //   jobTitle,
    //   jobDescription,
    //   file,
    // });

    if (!file) return;

    handleAnalyze({
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
