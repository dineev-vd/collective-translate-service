import { GetTranslateLanguage } from "common/dto/language.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LanguageDetails from "./LanguageDetails";
import "./LanguageList.css"
import LanguageSmall from "./LanguageSmall";

const LanguageList: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [languages, setLanguages] = useState<GetTranslateLanguage[]>([]);

    useEffect(() => {
        api.getLanguagesBtProjectId(+projectId).then(([response, _]) => {
            setLanguages(languages);
        })
    }, [projectId])

    return <div>
        {languages.map(language => (
            <LanguageSmall language={language} />
        ))}
        <Routes>
            <Route path=":languageId" element={<LanguageDetails />} />
        </Routes>
    </div>
}

export default LanguageList;