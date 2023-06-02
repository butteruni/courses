#include <iostream>
#include <vector>

#include "rope.h"
#include "CGL/vector2D.h"

#include "mass.h"
#include "spring.h"

namespace CGL {

    Rope::Rope(Vector2D start, Vector2D end, int num_nodes, float node_mass, float k, vector<int> pinned_nodes)
    {
        // TODO (Part 1): Create a rope starting at `start`, ending at `end`, and containing `num_nodes` nodes.
        if(num_nodes <= 1)
            return;
        Vector2D pos = start;
        Mass *cur_pos = new Mass(start, node_mass,0);
        masses.push_back(cur_pos);
        Mass *pre_pos = nullptr;
        Spring *curspring = nullptr;
        for(int i = 1;i <= num_nodes - 1;++i)
        {
            if(i == num_nodes - 1)
            {
                pos = end;
            }else 
            {
                pos = start + i * (end - start) / (num_nodes);
            }
            pre_pos = cur_pos;
            cur_pos = new Mass(pos,node_mass,0);
            curspring = new Spring(pre_pos,cur_pos,k);
            masses.push_back(cur_pos);
            springs.push_back(curspring);
        }
//        Comment-in this part when you implement the constructor
       for (auto &i : pinned_nodes) {
           masses[i]->pinned = true;
       }
    }

    void Rope::simulateEuler(float delta_t, Vector2D gravity)
    {
        for (auto &s : springs)
        {
            // TODO (Part 2): Use Hooke's law to calculate the force on a node
            Vector2D distance = s->m1->position - s->m2->position;
            Vector2D f = s->k * (distance / distance.norm()) * (distance.norm() - s->rest_length);
            s->m1->forces += -f;
            s->m2->forces += f;
        }

        for (auto &m : masses)
        {
            if (!m->pinned)
            {
                // TODO (Part 2): Add the force due to gravity, then compute the new velocity and position
                auto v = m->forces / (m->mass) + gravity;
                m->position += m->velocity * delta_t;
                m->velocity += v * delta_t;
                // TODO (Part 2): Add global damping

            }

            // Reset all forces on each mass
            m->forces = Vector2D(0, 0);
        }
    }

    void Rope::simulateVerlet(float delta_t, Vector2D gravity)
    {
        for (auto &s : springs)
        {
            // TODO (Part 3): Simulate one timestep of the rope using explicit Verlet （solving constraints)
            Vector2D distance = s->m1->position - s->m2->position;
            Vector2D f = s->k * (distance / distance.norm()) * (distance.norm() - s->rest_length);
            s->m1->forces += -f;
            s->m2->forces += f;
        }

        for (auto &m : masses)
        {
            if (!m->pinned)
            {
                // TODO (Part 3.1): Set the new position of the rope mass
                Vector2D temp_position = m->position;
                Vector2D v = m->forces / m->mass  + gravity;
                // TODO (Part 4): Add global Verlet damping
                double damping_factor = 0.00005;
                m->position = temp_position + (1 - damping_factor) 
                              * (temp_position - m->last_position) 
                              + v * delta_t * delta_t;
                m->last_position = temp_position;
            }
            m->forces  = Vector2D(0,0);
        }
    }
}
