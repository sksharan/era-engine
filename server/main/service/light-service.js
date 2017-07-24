import * as LightDao from '../dao/light-dao'

export const getAllLights = () => {
    return LightDao.getAllLights();
}

export const upsertLight = (light) => {
    return LightDao.upsertLight(light);
}

export const deleteLight = (lightId) => {
    return LightDao.deleteLight(lightId);
}
