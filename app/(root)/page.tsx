import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import Image from "next/image";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Chart } from "@/components/Chart";
import Link from "next/link";
import FormattedDateTime from "@/components/FormattedDateTime";
import { Separator } from "@/components/ui/separator";
import Thumbnail from "@/components/Thumbnail";
import ActionDropdown from "@/components/ActionDropdown";
import { Models } from "node-appwrite";
const Dashboard = async () => {
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 9 }),
    getTotalSpaceUsed(),
  ]);

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container grid grid-cols-2 gap-4 overflow-y-scroll max-h-[90vh] h-full">
      <section>
        <Chart used={totalSpace.used} />

        <ul className="dashboard-summary-list grid grid-cols-2 gap-x-4 gap-y-20">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4 ">
                <div className="relative ">
                  <Image
                    src={summary.icon}
                    alt="uploaded-image"
                    width={250}
                    height={800}
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size absolute top-11 left-42 font-semibold">
                    {convertFileSize(summary.size) || 0}
                  </h4>

                  <div className="absolute bg-white h-20 w-58.5 left-4">
                    <h5 className="summary-type-title absolute bottom-22 left-20 text-right font-bold text-xl ">
                      {summary.title}
                    </h5>
                    <Separator className="bg-light-200 absolute top-3 left-20.5 w-38" />
                    <h5 className="absolute top-5 left-36 w-32 font-light text-light-200 text-xs">
                      Last updated
                    </h5>

                    <FormattedDateTime
                      date={summary.latestDate}
                      className="text-center absolute top-10 left-24"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </section>
      {/*Recent Files */}
      <section className="dashboard-recent-files w-full h-fit px-4 py-4">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5 w-full">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                key={file.$id}
                target="_blank"
                className="flex items-center gap-3 w-full"
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />
                <div className="reent-file-details flex gap-4 items-center w-full ">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="recent-file-name">
                      {file.name.length > 15
                        ? file.name.slice(0, 15) + "..."
                        : file.name}
                    </p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
