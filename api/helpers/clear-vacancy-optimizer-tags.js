const clearVacancyContentTags = text => text.replace(/<\/?span[^>]*>/gi, " ");

module.exports = clearVacancyContentTags;
