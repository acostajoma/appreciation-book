import { z } from 'zod';
import {
	invalid_type_error,
	min_length_error,
	required_error,
    max_length_error,
    invalid_type_select_from_list,
    greater_than,
    less_or_equal_than,
    multiple_of_error,
    not_in_the_list_error,
    greater_or_equal_than,
} from '$lib/constants/validationMessages';
import { locationMap } from '$lib/utils/locationData.svelte';
import { currency, current_year, propertyTypes, saleTypes } from '$lib/constants/postConstants';

const text = (min : number = 2, max : number = 30) => z
    .string({ required_error, invalid_type_error })
    .trim()
    .min(min, min_length_error(min))
    .max(max, max_length_error(max))

const numeric = (min : number , max:number, step:number, formatNumber = true) => z
    .number({
        required_error,
        invalid_type_error,
    })
    .multipleOf(step, { message: multiple_of_error(step) })
    .min((min+step),{message:greater_than(min, formatNumber)})
    .max(max, less_or_equal_than(max, formatNumber))


const coordinates = (min : number , max:number) => z
    .number({
        required_error,
        invalid_type_error,
    })
    .gte(min, {message: greater_or_equal_than(min)})
    .lte(max, less_or_equal_than(max))
    .nullable()

const customEnum = (enumData: readonly [string, ...string[]]) => z
    .enum(enumData,{invalid_type_error, required_error, message: not_in_the_list_error})

const booleanField = z.boolean({
	invalid_type_error,
	required_error,
});

const postSchema = z
    .object({
        address: text(0, 400).nullable(),
        area: numeric(0, 100000000, 0.01),
        bathrooms: numeric(0, 20, 0.5).nullable(),
        bedrooms: numeric(0, 20, 1).nullable(),
        constructionArea: numeric(0, 10000000, 0.01).nullable(),
        constructionYear: numeric(1900, current_year, 1, false) ,
        canton: text(),
        currency: customEnum(currency),
        description: text(500).nullable(),
        district: text(),
        floors: numeric(1, 100, 1).nullable(),
        garageSpaces: numeric(0, 50, 1),
        latitude: coordinates(-90, 90),
        longitude: coordinates(-180, 180),
        price: numeric(0,1000000000, 0.01),
        propertyType: customEnum(propertyTypes),
        saleType: customEnum(saleTypes),
        province: text(),
        // Extra benefits grid 
        rentToOwnOption: booleanField.nullable(), 
        petFriendly: booleanField.nullable(),
        furnished : booleanField.nullable(),
        coworkingZone: booleanField.nullable(),
        hasGarden: booleanField.nullable(),
        negotiablePrice: booleanField.nullable(),
        onCondominium: booleanField.nullable(),
        gym : booleanField.nullable(),
        petsPark: booleanField.nullable(),
        kidsPark: booleanField.nullable(),
        bbqZone : booleanField.nullable(),
        visitParking: booleanField.nullable(),
    })
    .partial({
        address: true,
		bathrooms: true,
		bedrooms: true,
		constructionArea: true,
		constructionYear: true,
		description: true,
		floors: true,
        furnished: true,
		garageSpaces: true,
		hasGarden: true,
        negotiablePrice: true,
        onCondominium: true,
        rentToOwnOption: true,
		latitude: true,
		longitude: true,
        petFriendly: true,
        coworkingZone:true,
        gym : true,
        petsPark: true,
        kidsPark: true,
        bbqZone: true,
        visitParking: true,
    })
    .superRefine((val, ctx) => {
        const {province, canton, district} = val;
        const createIssue = (path : string[], message: string) => ctx.addIssue({
            code: z.ZodIssueCode.custom,
            fatal: true,
            message,
            path,
        });

        if(val.propertyType !== 'Terreno'){
            if(val.bathrooms == null){
                createIssue(['bathrooms'], 'La cantidad de baños es necesario para tipos de propiedades que no sean Terrenos.')
            } 
            if(val.garageSpaces == null){
                createIssue(['garageSpaces'], 'La cantidad de espacios de garage es necesario para tipos de propiedades que no sean Terrenos.')
            }
            if(val.constructionArea == null) {
                createIssue(['constructionArea'], 'El área de construcción es necesario para tipos de propiedades que no sean Terrenos.')
            }
            if(val.constructionYear == null) {
                createIssue(['constructionYear'], 'Este campo es necesario para tipos de propiedades que no sean Terrenos.')
            }
            if(val.floors == null) {
                createIssue(['floors'], 'Este campo es necesario para tipos de propiedades que no sean Terrenos.')
            }
            if(val.constructionArea && val.constructionArea > val.area){
                createIssue(['constructionArea'], 'El área de construcción no puede ser mayor al área del terreno.')
            }
            if(val.propertyType !== 'Bodega' && val.bedrooms == null){
                createIssue(['bedrooms'], 'La cantidad de cuartos es necesario.')
            }
        } 

        if(!locationMap.has(province)){
            createIssue(['province'], invalid_type_select_from_list);
            return z.NEVER;
        };
        const provinceCantons = locationMap.get(province);
        if(!provinceCantons?.has(canton)){
            createIssue(['canton'],invalid_type_select_from_list);
            return z.NEVER;
        };
        const cantonDistricts = provinceCantons.get(canton);
        if(!cantonDistricts?.has(district)){
            createIssue(['district'], invalid_type_select_from_list)
            return z.NEVER;
        };
    })

type PostSchema = typeof postSchema;


export {
	postSchema,
    type PostSchema
};
