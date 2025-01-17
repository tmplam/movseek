package mongo

import (
	"github.com/tmplam/movseek/internal/person"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (repo implRepository) buildPersonQuery(personID int64) bson.M {
	queryFilter := bson.M{
		"id": personID,
	}

	return queryFilter
}

func (repo implRepository) buildListPeopleQuery(input person.ListPeopleOptions) bson.M {
	queryFilter := bson.M{}
	if input.Query != "" {
		queryFilter["$or"] = []bson.M{
			{
				"name": bson.M{
					"$regex":   input.Query,
					"$options": "i",
				},
			},
			{
				"also_known_as": bson.M{
					"$regex":   input.Query,
					"$options": "i",
				},
			},
		}
	}

	if len(input.Filter.IDs) > 0 {
		queryFilter["id"] = bson.M{"$in": input.Filter.IDs}
	}

	return queryFilter
}

func (repo implRepository) buildGetPeopleOptions(input person.GetPersonFilter) *options.FindOptions {
	findOptions := options.Find()
	findOptions.SetLimit(int64(input.PerPage))
	findOptions.SetSkip(int64((input.Page - 1) * input.PerPage))

	return findOptions
}
