//
// Created by Göksu Güvendiren on 2019-05-14.
//

#include "Scene.hpp"


void Scene::buildBVH() {
    printf(" - Generating BVH...\n\n");
    this->bvh = new BVHAccel(objects, 1, BVHAccel::SplitMethod::NAIVE);
}

Intersection Scene::intersect(const Ray &ray) const
{
    return this->bvh->Intersect(ray);
}

void Scene::sampleLight(Intersection &pos, float &pdf) const
{
    float emit_area_sum = 0;
    for (uint32_t k = 0; k < objects.size(); ++k) {
        if (objects[k]->hasEmit()){
            emit_area_sum += objects[k]->getArea();
        }
    }
    float p = get_random_float() * emit_area_sum;
    emit_area_sum = 0;
    for (uint32_t k = 0; k < objects.size(); ++k) {
        if (objects[k]->hasEmit()){
            emit_area_sum += objects[k]->getArea();
            if (p <= emit_area_sum){
                objects[k]->Sample(pos, pdf);
                break;
            }
        }
    }
}

bool Scene::trace(
        const Ray &ray,
        const std::vector<Object*> &objects,
        float &tNear, uint32_t &index, Object **hitObject)
{
    *hitObject = nullptr;
    for (uint32_t k = 0; k < objects.size(); ++k) {
        float tNearK = kInfinity;
        uint32_t indexK;
        Vector2f uvK;
        if (objects[k]->intersect(ray, tNearK, indexK) && tNearK < tNear) {
            *hitObject = objects[k];
            tNear = tNearK;
            index = indexK;
        }
    }


    return (*hitObject != nullptr);
}
// Implementation of Path Tracing
Vector3f Scene::castRay(const Ray &ray, int depth) const
{
    // TO DO Implement Path Tracing Algorithm here
    Intersection isect = intersect(ray);
    if(!isect.happened)//没相交
    {   
        return Vector3f();
    }
    if(isect.m->hasEmission())//与光源相交
    {
        return isect.m->getEmission();
    }
    float Eplison = 1e-4;
    float pdf_light = 0.0;
    Vector3f l = 0.0;
    Vector3f l_in = 0.0;
    Intersection x_inter;
    sampleLight(x_inter,pdf_light);

    Vector3f p = isect.coords;
    Vector3f x = x_inter.coords;
    Vector3f ws = (x - p).normalized();
    float ws_dis = (x - p).norm();
    Vector3f N = isect.normal.normalized();
    Vector3f NN = x_inter.normal.normalized();
    Vector3f emit = x_inter.emit;

    Ray ws_ray(p, ws);

    Intersection ws_ray_inter = intersect(ws_ray);

    if(ws_ray_inter.distance - ws_dis > -Eplison)
    {
        l = emit * isect.m->eval(ray.direction,ws_ray.direction,N) 
                 * dotProduct(ws_ray.direction,N) 
                 * dotProduct(-ws_ray.direction,NN)
                 / std::pow(ws_dis,2)
                 / pdf_light;
    }

    if(get_random_float() > RussianRoulette)
    {
        return l;
    }
    Vector3f wi = isect.m->sample(ray.direction,N).normalized();
    Ray wi_ray(isect.coords,wi);
    Intersection wi_ray_inter = intersect(wi_ray);
    if(wi_ray_inter.happened && (!wi_ray_inter.m->hasEmission()))
    {
        l_in = castRay(wi_ray,depth + 1) 
            * isect.m->eval(ray.direction,wi_ray.direction,N)
            * dotProduct(wi_ray.direction,N)
            / isect.m->pdf(ray.direction,wi_ray.direction,N)
            / RussianRoulette;
    }
    return l + l_in;
}