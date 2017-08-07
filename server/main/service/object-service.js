import AdmZip from 'adm-zip'

export const createFromZip = (zipFile) => {
    const zip = new AdmZip(zipFile);
    const zipEntries = zip.getEntries();

    // TODO
    // for (let zipEntry of zipEntries) {
    //     console.log(zipEntry.toString());
    // }
}
