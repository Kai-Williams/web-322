const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

const initialize = () => {
    return new Promise((resolve, reject) => {
        try {
            setData.forEach(set => {
                const theme = themeData.find(t => t.id === set.theme_id)?.name
                sets.push({ ...set, theme })
            })
            resolve()
        } catch (error) {
            reject('Error initializing sets')
        }
    })
}

function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets); 
        } else {
            reject("No sets available");
        }
    });
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const foundSet = sets.find(set => set.set_num === setNum);

        if (foundSet) {
            resolve(foundSet); 
        } else {
            reject(`Set with number ${setNum} not found`); 
        }
    });
}

const getSetsByTheme = (theme) => {
    return new Promise((resolve, reject) => {
        try {
            const matchingSets = sets.filter(set => set.theme && set.theme.toLowerCase().includes(theme.toLowerCase()))
            if (matchingSets.length > 0) {
                resolve(matchingSets)
            } else {
                reject(`No sets found for theme: ${theme}`)
            }
        } catch (error) {
            reject(`Error occurred while searching for theme: ${error.message}`)
        }
    })
}

module.exports = {
    initialize,
    getAllSets,
    getSetByNum,
    getSetsByTheme
};