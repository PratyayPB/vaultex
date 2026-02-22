import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import Image from "next/image";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Chart } from "@/components/Chart";
import Link from "next/link";
import FormattedDateTime from "@/components/FormattedDateTime";
import { Separator } from "@/components/ui/separator";
import Thumbnail from "@/components/Thumbnail";
import ActionDropdown from "@/components/ActionDropdown";
import { FileDocument, TotalSpaceUsed } from "@/types";

const Dashboard = async () => {
  const [filesResult, totalSpaceResult] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  const files = filesResult as { documents: FileDocument[]; total: number } | null;
  const totalSpace = totalSpaceResult as TotalSpaceUsed | undefined;

  if (!totalSpace) {
    return <p className="text-center mt-20">Could not load storage data.</p>;
  }

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div
      className="dashboard-container flex flex-col gap-20 lg:grid grid-cols-2 gap-4 overflow-y-auto  
    lg:max-h-[90vh] h-full mx-5 my-5  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <section className="flex flex-col gap-4 w-full h-full">
        <Chart used={totalSpace.used} />

        <ul className="dashboard-summary-list grid grid-cols-2 gap-x-4 gap-y-20">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4 ">
                <div className="relative w-fit max-w-fit mx-auto">
                  <Image
                    src={summary.icon}
                    alt="uploaded-image"
                    width={250}
                    height={800}
                    className="summary-type-icon hidden lg:block "
                  />

                  {/* Mobile View  */}
                  <Image
                    src={summary.icon}
                    alt="uploaded-image"
                    width={200}
                    height={500}
                    className="summary-type-icon lg:hidden"
                  />

                  <h4 className="summary-type-size absolute top-11 left-42 font-semibold hidden lg:block">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                  {/* Mobile View  */}
                  <h4 className="summary-type-size absolute top-11 left-24 text-xl font-semibold lg:hidden">
                    {convertFileSize(summary.size) || 0}
                  </h4>

                  <div className="absolute bg-white h-20 w-58.5 left-4 hidden lg:block">
                    <h5 className="summary-type-title absolute bottom-22 left-20 text-right font-bold text-xl ">
                      {summary.title}
                    </h5>
                    <Separator className="bg-light-200 absolute top-3 left-20.5 w-38" />
                    <h5 className="absolute top-5 left-36 w-32 font-light text-light-200 text-xs">
                      Last updated
                    </h5>

                    <FormattedDateTime
                      date={String(summary.latestDate)}
                      className="text-center absolute top-10 left-24"
                    />
                  </div>
                  {/* Mobile View  */}
                  <div className="absolute bg-white h-20 w-46.75 left-[13px] lg:hidden">
                    <h5 className="summary-type-title absolute bottom-6 left-6 text-right font-bold text-xl lg:hidden ">
                      {summary.title}
                    </h5>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </section>
      {/*Recent Files */}
      <section className="dashboard-recent-files w-full h-full px-4 py-4 bg-white rounded-2xl ">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files && files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5 w-full">
            {files.documents.map((file: FileDocument) => (
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
